import handleFrontMatter from './transforms/handle-front-matter';
import handleMarkdown from './transforms/handle-markdown';
import wrapReact from './transforms/wrap-react';
import readContent from './read-content';
import writeContent from './write-content';

readContent('./content').catch((err) =>  console.log(err))
    .then(handleFrontMatter)
    .then(handleMarkdown)
    .then(wrapReact)
    .then(writeContent('./output'))
    .then((result) => {
        console.log(result.items);
    }).catch((err) => {
        console.log(err);
    });
