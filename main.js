import React from 'react';
import ReactDOMServer from 'react-dom/server';

import HtmlHeader from './components/HtmlHeader';

import handleFrontMatter from './handle-front-matter';
import readContent from './read-content';

readContent('./content').catch((err) => {
    console.log(err);    
}).then(handleFrontMatter).then((result) => {

    console.log(result);

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
