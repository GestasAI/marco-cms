import DataManager from '../components/dashboard/DataManager';

export default function Tags() {
    return (
        <DataManager
            collection="tags"
            title="Etiquetas"
            singularTitle="Etiqueta"
            basePath="/tags"
        />
    );
}
