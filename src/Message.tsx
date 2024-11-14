import React, { useState, useEffect, ReactNode } from 'react';

interface MessageProps {
  poem: string;
  interval?: number;
  children: (text: string) => ReactNode;
}

interface MessageState {
  text: string;
  rest: string[];
}

const Message: React.FC<MessageProps> = ({ poem, interval = 0, children }) => {
    const poemChars = (): string[] => poem.split("").concat([...Array(10)].map(() => ''));

    const [state, setState] = useState<MessageState>({ text: '', rest: poemChars() });

    useEffect(() => {
        const update = () => {
            setState(({ text, rest }) => {
                if (rest.length === 0) {
                    return { text: '', rest: poemChars() };
                }
                const line = text + rest.shift();
                return { text: line, rest };
            });
        };

        const i = setInterval(update, interval);
        return () => {
            clearInterval(i);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [interval, poem]);

    return <>{children(state.text)}</>;
};

export default Message;
