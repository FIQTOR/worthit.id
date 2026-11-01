import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

/**
 * Split text nodes into character and word spans for 3D flip / typography animations
 */
export function splitTextIntoSpans(element: HTMLElement): HTMLElement[] {
  const chars: HTMLElement[] = [];
  
  const processNode = (node: Node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent ?? '';
      if (!text) return;
      
      const fragment = document.createDocumentFragment();
      const tokens = text.split(/(\s+)/);
      
      tokens.forEach((token) => {
        if (!token) return;
        if (/^\s+$/.test(token)) {
          fragment.append(document.createTextNode(' '));
          return;
        }
        
        const wordSpan = document.createElement('span');
        wordSpan.className = 'w';
        
        [...token].forEach((char) => {
          const charSpan = document.createElement('span');
          charSpan.className = 'ch';
          charSpan.textContent = char;
          wordSpan.append(charSpan);
          chars.push(charSpan);
        });
        
        fragment.append(wordSpan);
      });
      
      node.parentNode?.replaceChild(fragment, node);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      Array.from(node.childNodes).forEach(processNode);
    }
  };

  Array.from(element.childNodes).forEach(processNode);
  return chars;
}
