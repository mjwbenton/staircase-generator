import React from 'react';
import ReactDOMServer from 'react-dom/server';

import HtmlHeader from '../components/HtmlHeader';
import { skipMeta, skipDirectories } from './skip-items';

export default function wrapReact(site) {
    return site.mapWithFilters([skipMeta, skipDirectories], (item) => {
        const DOCTYPE = '<!doctype html>';
        const html = DOCTYPE + '\n' + ReactDOMServer.renderToStaticMarkup(
            <html>
                <HtmlHeader />
                <body>
                    <div dangerouslySetInnerHTML={{ __html: item.getContent() }} />
                </body>
            </html>
        );
        return item.withContent(html);
    });
}
