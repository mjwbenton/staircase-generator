/* @flow */

import React from 'react';
import type { Photo } from '../features/flickr-set';

export default function Photos({photos} : {photos : Photo[]}) : React.Element {
    return <ul>
        {photos.map((p) =>
            <li key={p.id}><a href={p.pageUrl}><img src={p.url} /></a></li>
        )}
    </ul>;
}
