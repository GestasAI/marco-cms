import React, { useState } from 'react';
import { FileText, Layout, Palette, Image as ImageIcon, Layers } from 'lucide-react';
import { DocumentTab } from './unified-tabs/DocumentTab';
import { ContentTab } from './unified-tabs/ContentTab';
import { StyleTab } from './unified-tabs/StyleTab';
import { MediaTab } from './unified-tabs/MediaTab';
import { HierarchyTab } from './unified-tabs/HierarchyTab';

/**
 * Sidebar unificado que combina PropertiesSidebar y StylesPanel
 * Mantiene TODA la funcionalidad existente, solo reorganiza la UI
 */
export function UnifiedSidebar({
    document,
    setDocument,
    pageData,
    setPageData,
    selectedElement,
    contentSection,
    onUpdate,
    onUpdateMultiple,
    onUpdateStyle,
    onUpdateCustomStyle,
    onDelete,
    onMoveUp,
    onMoveDown,
    onDuplicate,
    onSelectElement
}) {
    const [activeTab, setActiveTab] = useState('document');

    const tabs = [
        { id: 'document', label: 'Document', icon: FileText },
        { id: 'content', label: 'Block', icon: Layout },
        { id: 'style', label: 'Style', icon: Palette },
        { id: 'media', label: 'Media', icon: ImageIcon },
        { id: 'hierarchy', label: 'Hierarchy', icon: Layers }
    ];

    const renderTabContent = () => {
        // HierarchyTab se muestra siempre
        if (activeTab === 'hierarchy') {
            return (
                <HierarchyTab
                    selectedElement={selectedElement}
                    contentSection={contentSection}
                    onUpdate={onUpdate}
                    onSelectElement={onSelectElement}
                    onDelete={onDelete}
                    onMoveUp={onMoveUp}
                    onMoveDown={onMoveDown}
                    onDuplicate={onDuplicate}
                />
            );
        }

        // DocumentTab se muestra siempre
        if (activeTab === 'document') {
            return (
                <DocumentTab
                    document={document}
                    setDocument={setDocument}
                    pageData={pageData}
                    setPageData={setPageData}
                />
            );
        }

        // Otras pestañas requieren elemento seleccionado
        if (!selectedElement) {
            return (
                <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                    <p>Selecciona un elemento para editarlo</p>
                </div>
            );
        }

        switch (activeTab) {
            case 'content':
                return (
                    <ContentTab
                        selectedElement={selectedElement}
                        onUpdate={onUpdate}
                        onUpdateCustomStyle={onUpdateCustomStyle}
                        onDelete={onDelete}
                        onMoveUp={onMoveUp}
                        onMoveDown={onMoveDown}
                        onDuplicate={onDuplicate}
                    />
                );
            case 'style':
                return (
                    <StyleTab
                        selectedElement={selectedElement}
                        onUpdateStyle={onUpdateStyle}
                        onUpdateCustomStyle={onUpdateCustomStyle}
                    />
                );
            case 'media':
                return (
                    <MediaTab
                        selectedElement={selectedElement}
                        onUpdate={onUpdate}
                        onUpdateMultiple={onUpdateMultiple}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="editor-sidebar unified-sidebar">
            {/* Header con nombre del elemento - Fijo */}
            <div className="editor-sidebar-header">
                {selectedElement ? selectedElement.element?.toUpperCase() : 'EDITOR'}
            </div>

            {/* Tabs Navigation - Fijo */}
            <div className="unified-tabs">
                {tabs.map(tab => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            className={`unified-tab ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                            title={tab.label}
                        >
                            <Icon size={14} />
                        </button>
                    );
                })}
            </div>

            {/* Tab Content - Scrollable */}
            <div className="editor-sidebar-content-scrollable">
                {renderTabContent()}
            </div>
        </div>
    );
}
