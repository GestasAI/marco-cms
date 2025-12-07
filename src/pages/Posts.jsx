import DataManager from '../components/dashboard/DataManager';

export default function Posts() {
    return (
        <DataManager
            collection="posts"
            title="Posts"
            singularTitle="Post"
            basePath="/posts"
        />
    );
}