import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/LookupField.css";

function LookupField({ options, defaultValue, onChange, entityName = "record"}) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    // Initialize selected from defaultValue and allow null when cleared
    const [selected, setSelected] = useState(defaultValue || null);

    const wrapperRef = useRef(null);

    const handleClickOutside = (e) => {
        if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        // add listener on mount, remove on unmount
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Update selected when defaultValue prop changes
    useEffect(() => {
        if (defaultValue) {
            setSelected(defaultValue);
            onChange(defaultValue); 
            setSearch("");
            setIsOpen(false);
        }
    }, [defaultValue]);

    const safeOptions = options || [];
    const filteredOptions = safeOptions.filter(o =>
        o.label.toLowerCase().includes(search.toLowerCase())
    );

    const selectItem = (value) => {
        setSelected(value);
        setSearch("");
        setIsOpen(false);
        onChange(value);
    };

    const clearValue = () => {
        setSelected(null);
        setSearch("");
    };

    return (
        <div className="crm-lookup" ref={wrapperRef}>
            {selected ? (
                <div className="crm-selected">
                    <Link to={`/${entityName}/${selected.id}`}>
                        {selected.label}
                    </Link>
                    <span className="crm-clear" onClick={clearValue}>×</span>
                </div>
            ) : (
                <input
                    className="crm-input"
                    placeholder={`Search ${entityName}...`}
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setIsOpen(true);
                    }}
                    onFocus={() => setIsOpen(true)}
                />
            )}

            {/* Dropdown */}
            {isOpen && !selected && (
                <div className="crm-dropdown">
                    {filteredOptions.length === 0 && (
                        <div className="crm-empty">No results</div>
                    )}
                    {filteredOptions.map(item => (
                        <div
                            key={item.id}
                            className="crm-option"
                            onClick={() => selectItem(item)}
                        >
                            {item.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default LookupField;