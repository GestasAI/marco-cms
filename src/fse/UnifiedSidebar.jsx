import React, { useState } from 'react';
import { FileText, Layout, Palette, Image as ImageIcon, Layers } from 'lucide-react';
import { ContentTab } from './unified-tabs/ContentTab';
import { SectionsTab } from './unified-tabs/SectionsTab';
import { StyleTab } from './unified-tabs/StyleTab';
import { MediaTab } from './unified-tabs/MediaTab';
import { HierarchyTab } from './unified-tabs/HierarchyTab';

/**
 * Sidebar unificado que combina PropertiesSidebar y StylesPanel
 * Mantiene TODA la funcionalidad existente, solo reorganiza la UI
 */
export function UnifiedSidebar({
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
    const [activeTab, setActiveTab] = useState('content');

    const tabs = [
        { id: 'content', label: 'Content', icon: FileText },
        { id: 'sections', label: 'Sections', icon: Layout },
        { id: 'style', label: 'Style', icon: Palette },
        { id: 'media', label: 'Media', icon: ImageIcon },
        { id: 'hierarchy', label: 'Hierarchy', icon: Layers }
    ];

    const renderTabContent = () => {
        // HierarchyTab se muestra siempre, incluso sin elemento seleccionado
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
                        onDelete={onDelete}
                        onMoveUp={onMoveUp}
                        onMoveDown={onMoveDown}
                        onDuplicate={onDuplicate}
                    />
                );
            case 'sections':
                return (
                    <SectionsTab
                        selectedElement={selectedElement}
                        onUpdateStyle={onUpdateStyle}
                        onUpdateCustomStyle={onUpdateCustomStyle}
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
