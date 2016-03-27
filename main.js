import React from 'react';
import ReactDOMServer from 'react-dom/server';

import HtmlHeader from './components/HtmlHeader';

import handleFrontMatter from './transforms/handle-front-matter';
import handleMarkdown from './transforms/handle-markdown';
import readContent from './read-content';

readContent('./content').catch((err) => {
    console.log(err);    
}).then(handleFrontMatter).then(handleMarkdown).then((result) => {

    console.log(result.items);

    const DOCTYPE = '<!doctype html>';
    const html = ReactDOMServer.renderToStaticMarkup(
    <html>
        <HtmlHeader />
        <body>
            <div>Hello World</div>
        </body>
    </html>
    );

    console.log(DOCTYPE);
    console.log(html);
})
