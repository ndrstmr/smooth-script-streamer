import React from 'react';
import { ScriptItem, TeleprompterState } from '@/hooks/useTeleprompterState';

export const renderScript = (script: ScriptItem[], speakerAliases: TeleprompterState['speakerAliases']) => {
  return script.map((item, index) => {
    let className = "mb-4 leading-relaxed";
    let content = item.text;

    switch (item.type) {
      case 'direction':
        className += " text-teleprompter-direction italic text-[0.8em]";
        break;
      case 'speaker-a':
        className += " text-teleprompter-text";
        content = content.replace(/^[^:]*:\s*/, '');
        return (
          <div key={index} className={className}>
            <span className="font-bold text-speaker-andreas">{speakerAliases['speaker-a']}: </span>
            {content}
          </div>
        );
      case 'speaker-b':
        className += " text-teleprompter-text";
        content = content.replace(/^[^:]*:\s*/, '');
        return (
          <div key={index} className={className}>
            <span className="font-bold text-speaker-achim">{speakerAliases['speaker-b']}: </span>
            {content}
          </div>
        );
      case 'speaker-andreas':
        className += " text-teleprompter-text";
        content = content.replace(/^[^:]*:\s*/, '');
        return (
          <div key={index} className={className}>
            <span className="font-bold text-speaker-andreas">{speakerAliases['speaker-andreas']}: </span>
            {content}
          </div>
        );
      case 'speaker-achim':
        className += " text-teleprompter-text";
        content = content.replace(/^[^:]*:\s*/, '');
        return (
          <div key={index} className={className}>
            <span className="font-bold text-speaker-achim">{speakerAliases['speaker-achim']}: </span>
            {content}
          </div>
        );
      default:
        className += " text-teleprompter-text";
    }

    return (
      <div key={index} className={className}>
        {content}
      </div>
    );
  });
};