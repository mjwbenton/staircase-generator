import React from 'react';
import ReactDOMServer from 'react-dom/server';

import HtmlHeader from './components/HtmlHeader';

import handleFrontMatter from './transforms/handle-front-matter';
import handleMarkdown from './transforms/handle-markdown';
import readContent from './read-content';
import writeContent from './write-content';

readContent('./content').catch((err) =>  console.log(err))
    .then(handleFrontMatter)
    .then(handleMarkdown)
    .then(writeContent('./output'))
    .then((result) => {
        console.log(result.items);
    }).catch((err) => {
        console.log(err);
    });
