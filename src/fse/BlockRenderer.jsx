import React, { useState, useEffect, useRef } from 'react';
import { acideService } from '../acide/acideService';
import { Search } from 'lucide-react';

export default function BlockRenderer({ blocks, context = {}, path = '' }) {
    if (!blocks || !Array.isArray(blocks)) return null;
    return (
        <>
            {blocks.map((block, index) => {
                const blockPath = path ? `${path}.${index}` : `${index}`;
                return <Block key={block.id || blockPath} block={block} context={context} path={blockPath} />;
            })}
        </>
    );
}

function Block({ block, context, path }) {
    const { type, className, content, blocks, innerBlocks, ...attrs } = block;
    const { selectedBlockId, selectBlock, editable, updateContent } = context;
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(content || attrs.text || '');
    const inputRef = useRef(null);

    const isSelected = selectedBlockId === path;
    const commonClasses = `${className || ''} ${editable ? 'block-selectable' : ''} ${isSelected ? 'block-selected' : ''}`;

    const handleSelect = (e) => {
        if (!editable) return;
        e.stopPropagation();
        if (selectBlock) selectBlock(path, block);
    };

    const handleDoubleClick = (e) => {
        if (!editable) return;
        e.stopPropagation();
        setIsEditing(true);
        setTimeout(() => inputRef.current?.focus(), 0);
    };

    const handleBlur = () => {
        setIsEditing(false);
        if (updateContent && block.id) {
            const field = type === 'core/button' ? 'text' : 'content';
            updateContent(block.id, field, editValue);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey && type !== 'core/paragraph') {
            e.preventDefault();
            handleBlur();
        }
        if (e.key === 'Escape') {
            setIsEditing(false);
            setEditValue(content || attrs.text || '');
        }
    };

    if (type === 'core/group' || type === 'core/container' || type === 'core/section') {
        const Component = type === 'core/section' ? 'section' : 'div';
        return (
            <Component className={commonClasses} onClick={handleSelect}>
                <BlockRenderer blocks={blocks || innerBlocks} context={context} path={path} />
            </Component>
        );
    }

    if (type === 'core/heading') {
        const Tag = `h${attrs.level || 2}`;
        const headingClass = `heading-${attrs.level || 2}`;

        if (editable && isEditing) {
            return (
                <input
                    ref={inputRef}
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    className={`${headingClass} ${commonClasses} inline-editor`}
                    style={{ width: '100%', background: 'transparent', border: 'none', outline: '2px solid #6366f1', padding: '4px' }}
                />
            );
        }

        return (
            <Tag
                className={`${headingClass} ${commonClasses}`}
                onClick={handleSelect}
                onDoubleClick={handleDoubleClick}
            >
                {content || 'Doble click para editar'}
            </Tag>
        );
    }

    if (type === 'core/paragraph') {
        if (editable && isEditing) {
            return (
                <textarea
                    ref={inputRef}
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    className={`text-body ${commonClasses} inline-editor`}
                    style={{ width: '100%', minHeight: '60px', background: 'transparent', border: 'none', outline: '2px solid #6366f1', resize: 'vertical', padding: '4px' }}
                />
            );
        }

        return (
            <p
                className={`text-body ${commonClasses}`}
                onClick={handleSelect}
                onDoubleClick={handleDoubleClick}
            >
                {content || 'Doble click para editar'}
            </p>
        );
    }

    if (type === 'core/button') {
        const relProps = [];
        if (attrs.nofollow) relProps.push('nofollow');
        if (attrs.target === '_blank') relProps.push('noopener', 'noreferrer');

        const handleButtonClick = (e) => {
            if (editable) e.preventDefault();
            handleSelect(e);
        };

        const handleButtonDoubleClick = (e) => {
            if (editable) {
                e.preventDefault();
                handleDoubleClick(e);
            }
        };

        if (editable && isEditing) {
            return (
                <div className={`btn btn-primary ${commonClasses}`} style={{ display: 'inline-block' }}>
                    <input
                        ref={inputRef}
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={handleBlur}
                        onKeyDown={handleKeyDown}
                        className="inline-editor"
                        style={{ background: 'transparent', border: 'none', outline: '2px solid #6366f1', color: 'inherit', width: 'auto', minWidth: '100px', padding: '2px 4px' }}
                    />
                </div>
            );
        }

        return (
            <a
                href={attrs.link || '#'}
                className={`btn btn-primary ${commonClasses}`}
                target={attrs.target || '_self'}
                rel={relProps.length > 0 ? relProps.join(' ') : undefined}
                onClick={handleButtonClick}
                onDoubleClick={handleButtonDoubleClick}
            >
                {attrs.text || 'Doble click para editar'}
            </a>
        );
    }

    if (type === 'core/search') {
        return (
            <div className={commonClasses} onClick={handleSelect}>
                <Search size={20} />
                <input type="text" placeholder={attrs.placeholder || 'Buscar...'} className="w-full bg-transparent outline-none" readOnly={context.editable} />
            </div>
        );
    }

    if (type === 'core/site-logo') return <div className={commonClasses} onClick={handleSelect}>{content || 'M'}</div>;
    if (type === 'core/site-title') {
        const Tag = attrs.tag || 'h1';
        return <Tag className={`heading-1 ${commonClasses}`} onClick={handleSelect}>Marco CMS</Tag>;
    }
    if (type === 'core/template-part') return <div className={commonClasses} onClick={handleSelect}><TemplatePart slug={attrs.slug} context={context} path={path} /></div>;
    if (type === 'core/query-loop') return <div className={commonClasses} onClick={handleSelect}><QueryLoop block={block} context={context} path={path} /></div>;
    if (type.startsWith('core/post-')) return <PostBlock type={type} block={block} context={context} path={path} commonClasses={commonClasses} onSelect={handleSelect} />;
    return <div className={`card ${commonClasses}`} onClick={handleSelect}>Unknown: {type}</div>;
}

function TemplatePart({ slug, context, path }) {
    const [part, setPart] = useState(null);
    useEffect(() => {
        fetch(`/themes/gestasai-default/parts/${slug}.json`).then(res => res.json()).then(setPart).catch(err => console.error(err));
    }, [slug]);
    if (!part) return null;
    return <BlockRenderer blocks={part.blocks} context={context} path={`${path}.part.${slug}`} />;
}

function QueryLoop({ block, context, path }) {
    const [items, setItems] = useState([]);
    const { collection, limit, innerBlocks } = block;
    useEffect(() => {
        acideService.list(collection || 'posts').then(data => {
            const sorted = (data || []).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            setItems(sorted.slice(0, limit || 6));
        }).catch(err => console.error(err));
    }, [collection, limit]);
    if (!items.length) return <div className="text-center text-body">Sin contenidos</div>;
    return (
        <div className="grid grid-3">
            {items.map((item, i) => (
                <div key={item.id} className="card">
                    <BlockRenderer blocks={innerBlocks} context={{ ...context, post: item }} path={`${path}.${i}`} />
                </div>
            ))}
        </div>
    );
}

function PostBlock({ type, block, context, commonClasses, onSelect }) {
    const { post, editable, updatePost } = context;
    if (!post) return null;
    const { className, ...attrs } = block;

    if (type === 'core/post-title') {
        const Tag = attrs.tag || 'h2';
        if (editable) return <input type="text" value={post.title || ''} onChange={(e) => updatePost('title', e.target.value)} placeholder="Título" className={`heading-2 ${commonClasses} bg-transparent border-none outline-none w-full`} onClick={onSelect} />;
        return <Tag className={`heading-2 ${commonClasses}`}>{post.title}</Tag>;
    }
    if (type === 'core/post-excerpt') {
        if (editable) return <textarea value={post.excerpt || ''} onChange={(e) => updatePost('excerpt', e.target.value)} placeholder="Resumen" className={`text-body ${commonClasses} w-full bg-transparent border-none outline-none resize-none h-20`} onClick={onSelect} />;
        return <p className={`text-body ${commonClasses}`}>{post.excerpt}</p>;
    }
    if (type === 'core/post-content') {
        if (editable) return <textarea value={post.content || ''} onChange={(e) => updatePost('content', e.target.value)} placeholder="Contenido" className={`text-body ${commonClasses} w-full min-h-[500px] bg-transparent border-none outline-none resize-y`} onClick={onSelect} />;
        return <div className={`text-body ${commonClasses}`}>{post.content}</div>;
    }
    if (type === 'core/post-featured-image') return <div className={commonClasses} onClick={onSelect}>{post.featured_image ? <img src={post.featured_image} alt="Featured" className="w-full h-auto" /> : <span className="text-body">{editable ? 'Click para imagen' : ''}</span>}</div>;
    if (type === 'core/read-more') return <a href={`/posts/${post.slug || post.id}`} className={`btn ${commonClasses}`} onClick={onSelect}>{attrs.text || 'Leer más'}</a>;
    return null;
}
