import { Check, X } from "lucide-react";
import React from "react";
import ToggleButton from 'react-toggle-button'

function ToggleControl({ label, value, toggle }) {
    return (

        <div style={{display: "flex", gap: "0.5rem"}}>
            <p>{label}</p>
            <ToggleButton
                value={value}
                onToggle={toggle}
                inactiveLabel={<X />}
                activeLabel={<Check />}
                colors={{
                    active: {
                        base: 'rgb(17, 124, 206)',
                        hover: 'rgba(17, 124, 206, 0.8)',
                    },
                }}
            />
        </div>
    )
}

export default ToggleControl;