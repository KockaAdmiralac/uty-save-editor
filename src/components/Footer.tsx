import React from 'react';
import pkg from '../../package.json';

const Footer: React.FC = () => {
    return <footer className="mt-10 border-t-2 border-dashed pt-2">
        Made by <a href="https://kocka.tech/">KockaAdmiralac</a>. Source code
        available on <a href="https://github.com/KockaAdmiralac/uty-save-editor">
        GitHub</a>. Please submit feedback through <a href="https://github.com/KockaAdmiralac/uty-save-editor/issues">
        GitHub Issues</a>. Current version: <em>{pkg.version}</em>.
    </footer>
};

export default Footer;
