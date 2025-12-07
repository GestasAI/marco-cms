import DataManager from '../components/dashboard/DataManager';

export default function Pages() {
    return (
        <DataManager
            collection="pages"
            title="Páginas"
            singularTitle="Página"
            basePath="/pages"
        />
    );
}
