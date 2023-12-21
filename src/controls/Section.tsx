import React from 'react';

interface Props {
    children: React.ReactNode;
    name: string;
};

const Section: React.FC<Props> = ({ children, name }) => {
    return <section className="mb-16 w-full">
        <h2 className="text-2xl mb-8 text-center">{name}</h2>
        {children}
    </section>;
};

export default Section;
