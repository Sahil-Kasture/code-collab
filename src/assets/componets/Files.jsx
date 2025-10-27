import React from "react";

function Files(props) {
    return (
        <div className="flex flex-col gap-2 ">
            
            <ul className="list-disc list-inside">
                <li style={{ cursor: "pointer" ,listStyleType: "none"}} className="w-full pt-2 pl-2 pb-2 text-left min-h-8 border border-transparent hover:focus text-white hover:border-dotted hover:border-white " onClick={() => props.setFileName(props.fileName)}>
                    {props.fileName}
                </li>
            </ul>
        </div>
    )
}

export default Files;

     