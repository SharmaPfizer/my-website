/*
 * Copyright 2023 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
/* global WebImporter */
/* eslint-disable no-console, class-methods-use-this */


const createMetadata = (main, document) => {
    const meta = {};
  
    const title = document.querySelector('title');
    if (title) {
      meta.Title = title.innerHTML.replace(/[\n\t]/gm, '');
    }
  
    const desc = document.querySelector('[property="og:description"]');
    if (desc) {
      meta.Description = desc.content;
    }
  
    const img = document.querySelector('[property="og:image"]');
    if (img && img.content) {
      const el = document.createElement('img');
      el.src = img.content;
      meta.Image = el;
    }

    const keyword = document.querySelector('[property="keywords"]')
    if (keyword && keyword.content) {
      meta.Keyword = keyword.content;
    }

    const cells = [
        ['Metadata']
      ];
      if(meta.Title) cells.push(["Title", meta.Title]);
      if(meta.Description) cells.push(["Description", meta.Description]);
      if(meta.Image) cells.push(["Image", meta.Image]);
      if(meta.Keyword) cells.push(["Keywords", meta.keyword]);

      const table = WebImporter.DOMUtils.createTable(cells, document);
      main.append(table);
  
    //const block = WebImporter.Blocks.getMetadataBlock(document, meta);
    //main.append(block);
  
    return meta;
  };

  const fetchImages = (main, document) => {
    const image = {};
    const cells = [
      ['#','Images', 'Alt Text']
    ]
    const allImageTags = document.querySelectorAll("img");

    for(let i=0; i<allImageTags.length; i++){
      cells.push([(i+1), allImageTags[i].src, allImageTags[i].alt]);
    }
    
    const table = WebImporter.DOMUtils.createTable(cells, document);
    main.append(table);
  }
  
  export default {
    /**
     * Apply DOM operations to the provided document and return
     * the root element to be then transformed to Markdown.
     * @param {HTMLDocument} document The document
     * @param {string} url The url of the page imported
     * @param {string} html The raw html (the document is cleaned up during preprocessing)
     * @param {object} params Object containing some parameters given by the import process.
     * @returns {HTMLElement} The root element to be transformed
     */
    transformDOM: ({
      // eslint-disable-next-line no-unused-vars
      document, url, html, params,
    }) => {
      // define the main element: the one that will be transformed to Markdown
      const main = document.body;
      
      // create the metadata block and append it to the main element
      createMetadata(main, document);
      fetchImages(main, document);
      // use helper method to remove header, footer, etc.
      WebImporter.DOMUtils.remove(main, [
        'header',
        'footer',
      ]);
  
      return main;
    },

    /*transform: ({ document, params }) => {
      const main = document.body;
  
      const listOfAllImages = [...main.querySelectorAll('img')].map((img) => {
        return {source: img.src, content: img.alt};
      }).filter((img) => img);

      const listOfAllMeta = [...document.querySelectorAll('meta')].map((meta) => { 
        const propKeys = ["og:description", "description", "keywords"]
        const name = meta.getAttribute('name') || meta.getAttribute('property');
        if (propKeys.indexOf(name)>-1) {
          return { name, content: meta.content }
        }
        return null;
      }).filter((meta) => meta);

      const getDescription = () => {
        const desc = document.querySelector("meta[property='description']") ? document.querySelector("meta[property='description']") : document.querySelector("meta[name='description']");
        return desc && desc.content ? desc.content : "";
      }

      const getOgDescription = () => {
        const ogDesc = document.querySelector("meta[property='og:description']") ? document.querySelector("meta[property='og:description']") : document.querySelector("meta[name='og:description']");
        return ogDesc && ogDesc.content ? ogDesc.content : "";
      }
  
      return [{
        element: main,
        path: new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, ''),
        report: {
          title: document.title,
          description: getDescription(),
          ogDescriptoin: getOgDescription()
        }
      }];
    },*/
  
    /**
     * Return a path that describes the document being transformed (file name, nesting...).
     * The path is then used to create the corresponding Word document.
     * @param {HTMLDocument} document The document
     * @param {string} url The url of the page imported
     * @param {string} html The raw html (the document is cleaned up during preprocessing)
     * @param {object} params Object containing some parameters given by the import process.
     * @return {string} The path
     */
    generateDocumentPath: ({
      // eslint-disable-next-line no-unused-vars
      document, url, html, params,
    }) => WebImporter.FileUtils.sanitizePath(new URL(url).pathname.replace(/\.html$/, '').replace(/\/$/, '')),
  };