import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import Face from '@/components/shared/Face';

type ProjectDisplayProps = {
    response: any;
    handleUploadClick: () => void;
};

const SearchedProjects
    = ({ response, handleUploadClick }: ProjectDisplayProps) => {
        return (
            <div className="h-48">
                <div className="w-full h-full grid grid-cols-4 gap-4">
                    {!response ? (
                        <>
                            <Skeleton className="w-full h-full rounded-xl" />
                            <div className="flex flex-col justify-between pb-4">
                                <div className=" space-y-1">
                                    <Skeleton className="h-4 w-full max-w-[250px]" />
                                    <Skeleton className="h-4 w-full leading-none max-w-[200px]" />
                                    <Skeleton className="h-4 w-full leading-none max-w-[300px]" />
                                    <Skeleton className="h-4 w-full leading-none max-w-[200px]" />
                                </div>
                                <Skeleton className="h-10 w-full max-w-[100px]" />
                            </div>
                        </>
                    ) : (
                        <>
                            <Face projectId={response._id} />
                            <div className="flex flex-col justify-between space-y-2 pb-4">
                                <div className="">
                                    <h3 className="font-bold text-sm">{response.projectName}</h3>
                                    <p className="text-sm line-clamp-3">{response.description}</p>
                                    <h3 className="text-sm">
                                        <span className="font-bold">Owner: </span> {response.owner}
                                    </h3>
                                </div>
                                <div className="flex items-center justify-start">
                                    <Button className="font-bold" onClick={handleUploadClick}>Upload</Button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        );
    };

export default SearchedProjects
    ;