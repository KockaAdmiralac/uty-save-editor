import React from 'react';

interface Props {
    children: React.ReactNode;
    name: string;
};

const Section: React.FC<Props> = ({ children, name }) => {
    return <section className="mb-16">
        <h2 className="text-2xl mb-8">{name}</h2>
        {children}
    </section>;
};

export default Section;
