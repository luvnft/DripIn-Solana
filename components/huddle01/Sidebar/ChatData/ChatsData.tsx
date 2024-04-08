import clsx from 'clsx';
import Link from 'next/link';
import { BasicIcons } from '@/utils/BasicIcons';
import { IChatMessage, useStudioState } from '@/lib/huddle01/studio/studioState';

export default function ChatsData() {
    const { chatMessages } = useStudioState();

    const validateUrl = (text: string) => {
        const urlRegex =
            /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w\.-]*)*\/?$/;
        return urlRegex.test(text);
    };

    return (
        <>
            {chatMessages.map((chat: IChatMessage) => {
                return (
                    <div
                        key={chat.name}
                        className={clsx(
                            chat.isUser
                                ? 'ml-auto text-md break-words max-w-xs w-fit py-1 px-2 mb-2 bg-[#8852f380] rounded-lg items-center flex'
                                : 'w-fit py-1 px-2 break-words max-w-xs text-md mb-2 rounded-lg bg-slate-200 dark:bg-slate-700',
                            validateUrl(chat.text) && 'hover:bg-[#8852f380]'
                        )}
                    >
                        <div className='text-xs text-[#8752F3]'>
                            {chat.isUser ? null : chat.name}
                        </div>
                        {validateUrl(chat.text) ? (
                            <Link href={chat.text} target='_blank' rel='noreferrer'>
                                <div className='flex gap-2 text-sm items-center justify-center'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-link"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
                                    <span>{chat?.text}</span>
                                </div>
                            </Link>
                        ) : (
                            chat.text
                        )}
                    </div>
                );
            })}
        </>
    );
};

// export default ChatsData;
