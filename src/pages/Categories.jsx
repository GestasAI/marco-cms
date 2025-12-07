import DataManager from '../components/dashboard/DataManager';

export default function Categories() {
    return (
        <DataManager
            collection="categories"
            title="Categorías"
            singularTitle="Categoría"
            basePath="/categories"
        />
    );
}
