import React from 'react';
import pkg from '../../package.json';

const Footer: React.FC = () => {
    return <footer className="mt-10 border-t-2 border-dashed pt-2">
        Made by <a href={pkg.author.url}>{pkg.author.name}</a>. Source code
        available on <a href={pkg.repository.url}>GitHub</a>. Please submit
        feedback through <a href={pkg.bugs.url}>GitHub Issues</a>. Current
        version: <a href={`${pkg.repository.url}/releases/tag/v${pkg.version}`}>
        {pkg.version}</a>.
    </footer>
};

export default Footer;
