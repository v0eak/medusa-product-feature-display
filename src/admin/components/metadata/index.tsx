import { useEffect, useState, useRef } from "react"

import Dropdown from "./dropdown"

export default function Metadata ({fd, notify, metadata, setMetadata}) {
    const [focusedInput, setFocusedInput] = useState(null);
    const keyInputRef = useRef(null);
    const valueInputRef = useRef(null);
    const [openDropdownIndex, setOpenDropdownIndex] = useState(null)

    const handleInputChange = (e, index, field) => {
        const newMetadata = [...metadata];
    
        if (field === 'key') {
            newMetadata[index].key = e.target.value;
        } else {
            newMetadata[index].value = e.target.value;
        }
        setMetadata(newMetadata);
    };
    
    const handleInitialInputChange = (e) => {
        if (focusedInput === 'keyInput') {
            setMetadata([{ key: e.target.value, value: '' }]);
        } else if (focusedInput === 'valueInput') {
            setMetadata([{ key: '', value: e.target.value }]);
        }
    };

    useEffect(() => {
        if (fd && fd.metadata !== null) {
            setMetadata(Object.entries(fd.metadata).map(([key, value]) => ({ key, value })));
        } else {
            setMetadata(null)
        }
      }, [])
    
      useEffect(() => {
        if (metadata !== null) {
            if (focusedInput === 'keyInput' && keyInputRef.current) {
                keyInputRef.current.focus();
                setFocusedInput(null)
            } else if (focusedInput === 'valueInput' && valueInputRef.current) {
                valueInputRef.current.focus();
                setFocusedInput(null)
            }
        }
    }, [metadata, focusedInput]);

    return (
        <div className="rounded-rounded border-grey-20 divide-grey-20 inter-base-regular divide-y border relative z-5">
            <div className="inter-small-semibold bg-grey-5 rounded-t-rounded divide-grey-20 grid grid-cols-[165px_1fr] divide-x divide-solid">
                <div className="px-base py-xsmall">
                    <p>Key</p>
                </div>
                <div className="px-base py-xsmall">
                    <p>Value</p>
                </div>
            </div>

            {metadata !== null ? metadata.map(({ key, value }, index) => (
                <div key={index} className="divide-grey-20 grid grid-cols-[165px_1fr_auto] divide-x divide-solid last-of-type:rounded-b-rounded group">
                    <div className="px-base py-xsmall">
                        <input ref={keyInputRef} name={`metadata.${index}.key`} placeholder="Key" value={metadata[index].key} onChange={(e) => handleInputChange(e, index, 'key')} className="placeholder:text-grey-40 placeholder:inter-base-regular w-full appearance-none outline-none" />
                    </div>
                    <div className="px-base py-xsmall">
                        <input ref={valueInputRef} name={`metadata.${index}.value`} placeholder="Value" value={metadata[index].value} onChange={(e) => handleInputChange(e, index, 'value')} className="placeholder:text-grey-40 placeholder:inter-base-regular w-full appearance-none outline-none" />
                    </div>
                    <div className={`px-base py-xsmall flex justify-end items-center group-hover:visible ${openDropdownIndex === index ? 'visible' : 'invisible'}`}>
                        <Dropdown metadata={metadata} setMetadata={setMetadata} index={index} notify={notify} setOpenDropdownIndex={setOpenDropdownIndex} />
                    </div>
                </div>
            )) : (
                <div className="divide-grey-20 grid grid-cols-[165px_1fr_auto] divide-x divide-solid last-of-type:rounded-b-rounded group">
                    <div className="px-base py-xsmall">
                        <input name="metadata.0.key" placeholder="Key" onChange={(e) => handleInitialInputChange(e)} onFocus={() => setFocusedInput('keyInput')} className="placeholder:text-grey-40 placeholder:inter-base-regular w-full appearance-none outline-none" />
                    </div>
                    <div className="px-base py-xsmall">
                        <input name="metadata.0.value" placeholder="Value" onChange={(e) => handleInitialInputChange(e)} onFocus={() => setFocusedInput('valueInput')} className="placeholder:text-grey-40 placeholder:inter-base-regular w-full appearance-none outline-none" />
                    </div>
                    <div className={`px-base py-xsmall flex justify-end items-center group-hover:visible ${openDropdownIndex === 0 ? 'visible' : 'invisible'}`}>
                        <Dropdown metadata={metadata} setMetadata={setMetadata} index={0} notify={notify} setOpenDropdownIndex={setOpenDropdownIndex} />
                    </div>
                </div>
            )}

        </div>
    )
}