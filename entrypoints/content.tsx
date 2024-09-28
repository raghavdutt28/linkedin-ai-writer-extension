//raghavd.bitmesra@gmail.com
//Asdf$$22aa

import { createRoot } from "react-dom/client";
import App from "./src/App";

export default defineContentScript({
  matches: ['*://*.linkedin.com/*'],
  runAt: 'document_start',
  main() {
    //making sure the live page is fully loaded
    document.addEventListener('DOMContentLoaded', function () {
      const messageInputSelector = 'div.msg-form__contenteditable';
      // for handeling multiple message inputs opened simultaneously.
      const attachedListeners = new Set();
      //flag for icon click
      let isIconClicked = false;
      //refernce to last focused element, passed to App for inserting data.
      let lastFocusedEditableDiv: HTMLElement | null = null;
      let resizeScrollTimeout: number | undefined;
      const TIMEOUT_DELAY = 250;
      const DEBOUNCE_DELAY = 200;

      const positioningListeners: { scrollHandler: EventListener; resizeHandler: EventListener }[] = [];




      // Positioning function for the icon
      function positionIcon(iconContainer: HTMLElement, messageInputField: Element) {
        const inputRect = messageInputField?.getBoundingClientRect();
        if (inputRect) {
          iconContainer.style.top = `${window.scrollY + inputRect.bottom - 30}px`
          iconContainer.style.left = `${window.scrollX + inputRect.left + inputRect.width - 32}px`;
        }
      }
      //debouncing logic for fast scrolling or resizing(just incase)
      function debouncePositionIcon(iconContainer: HTMLElement, messageInputField: Element) {
        if (resizeScrollTimeout) {
          // Clear the existing timeout if there's one
          clearTimeout(resizeScrollTimeout);
        }
        resizeScrollTimeout = window.setTimeout(() => {
          positionIcon(iconContainer, messageInputField);
        }, DEBOUNCE_DELAY);
      }
      //handling them outside the injection func to decrease number of calls
      function addPositioningListeners(iconContainer: HTMLElement, messageInputField: Element) {
        const handleScroll = () => debouncePositionIcon(iconContainer, messageInputField);
        const handleResize = () => debouncePositionIcon(iconContainer, messageInputField);
        window.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', handleResize);
        positioningListeners.push({ scrollHandler: handleScroll, resizeHandler: handleResize });
      }

      function cleanupPositioningListeners() {
        positioningListeners.forEach(({ scrollHandler, resizeHandler }) => {
          window.removeEventListener('scroll', scrollHandler);
          window.removeEventListener('resize', resizeHandler);
        });
        positioningListeners.length = 0;
        console.log("Cleaned up all positioning listeners.");
      }




      //Injection function
      function injectIcon(messageInputField: Element) {

        const iconContainer = document.createElement('div');
        iconContainer.classList.add('custom-extension-icon');
        iconContainer.style.position = 'absolute';
        iconContainer.style.display = 'none';
        iconContainer.style.zIndex = '80';

        //shadow dom for safe placement(Copied it from grammerly)
        const shadowRoot = iconContainer.attachShadow({ mode: 'open' });

        //taiwind, custom font for shadow DOM
        const tailwindLink = document.createElement('link');
        tailwindLink.rel = 'stylesheet';
        tailwindLink.href = 'https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css';
        shadowRoot.appendChild(tailwindLink);

        const fontLink = document.createElement('link');
        fontLink.rel = 'stylesheet';
        fontLink.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap";
        shadowRoot.appendChild(fontLink);



        //todo: add styling for icon --done
        const appElement = createRoot(shadowRoot);
        appElement.render(
          <App
            lastFocusedDiv={lastFocusedEditableDiv}
            onUnmount={() => {
              iconContainer.remove();
              cleanupPositioningListeners();
            }}
          />
        );
        document.body.appendChild(iconContainer);



        positionIcon(iconContainer, messageInputField);
        handleClickIcon(iconContainer);
        iconContainer.style.display = 'block';


        //handling repositioning on multiple resize, scroll events
        addPositioningListeners(iconContainer, messageInputField)
      }

      function handleClickIcon(iconContainer: HTMLElement) {
        //by default blur for messageInputField is registered before click for Icon.
        //so when we click the icon, blur event runs first and isIconClicked is set to false.
        iconContainer.addEventListener('click', function () {
          isIconClicked = true;
        });
      }



      function attachFocusListener(messageInputField: Element) {
        if (!attachedListeners.has(messageInputField)) {
          attachedListeners.add(messageInputField);

          messageInputField.addEventListener('focus', function () {
            lastFocusedEditableDiv = messageInputField as HTMLElement;
            setTimeout(() => {
              console.log('Message input focused!');
              const iconContainer = document.querySelector('.custom-extension-icon');
              if (!iconContainer) {
                injectIcon(messageInputField);
                chrome.runtime.sendMessage({ type: 'enable_icon' });
              }
            }, TIMEOUT_DELAY);
          });

          messageInputField.addEventListener('blur', function () {
            //Timeout purpose: blur for messageInputField is registered before click for Icon
            //hence it will be removed before registering click event
            setTimeout(() => {
              console.log('Message input blurred!');
              if (!isIconClicked) {
                const iconContainer = document.querySelector('.custom-extension-icon');
                if (iconContainer) {
                  chrome.runtime.sendMessage({ type: 'disable_icon' });
                  iconContainer.remove();
                  cleanupPositioningListeners();
                  console.log('Removing icon container');
                }
              }
            }, TIMEOUT_DELAY);
            isIconClicked = false;
          });
        }
      }



      //initial check and attach listeners when the page loads
      function checkAndAttachListeners() {
        const messageInputFields = document.querySelectorAll(messageInputSelector);
        messageInputFields.forEach(attachFocusListener);
      }

      //Attaching mutation observer and then if mutation is of our element then attaching listener
      const observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
          [...mutation.addedNodes].forEach((node) => {
            //if node is message input element then attach focus listener directly.
            if (node instanceof Element && node.matches(messageInputSelector)) {
              attachFocusListener(node);
            }//else attach on all message input elements maybe they are affected by mutation indirectly
            else if (node instanceof Element && node.querySelector(messageInputSelector)) {
              checkAndAttachListeners();
            }
          });
        });
      });

      observer.observe(document.body, { childList: true, subtree: true });


      checkAndAttachListeners();
    });
  },
});