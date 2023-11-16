"use client"
import React, { useState } from "react"
import { Bebas_Neue, Quicksand } from 'next/font/google'

const bebas_neue = Bebas_Neue({
    subsets: ["latin"],
    weight: "400",
})

const quicksand = Quicksand({
    subsets: ["latin"],
    weight: "500",
})

export default function FeatureDisplays ({fd}) {
    const [currentPlay, setCurrentPlay] = useState(0)

    return (
        <div className={`w-full flex items-center justify-center py-20`} style={{backgroundColor: fd.metadata?.background ? fd.metadata?.background : ''}}>
            {fd.metadata?.align === 'left' && (
                fd.images[currentPlay]?.url?.endsWith('.webm') ? (
                    <video autoPlay loop muted typeof="video/mp4" src={fd.images[currentPlay]?.url} className="h-96 w-[683px]" />
                ) : (
                    <img src={fd.images[currentPlay]?.url} className="h-96" />
                )
            )}
            <div className={`flex flex-col ${fd.images.length === 0 && 'items-center'} font-bold px-16 max-w-3xl`}>
                <span className={`max-w-xl text-3xl text-[#3EB489] tracking-wider ${bebas_neue.className}`}>{fd.title}</span>
                <span className={`${quicksand.className}`} style={{color: fd.metadata?.textcolor ? fd.metadata?.textcolor : '#525252'}}>{
                    fd.description && fd.description.split('<br>').map((part, index, array) => (
                        <React.Fragment key={index}>
                            {part}
                            {index < array.length - 1 && <br />}
                        </React.Fragment>
                    ))
                }</span>
                {fd.images.length > 1 && (
                    <div className="pt-5 flex gap-x-4">
                        {fd.images.map((img, index) => (
                            <div key={index} onClick={() => setCurrentPlay(index)} className={`h-4 w-4 rounded-full ${index === currentPlay ? 'bg-[#3EB489]' : 'border border-gray-300'} cursor-pointer`} />
                        ))}
                    </div>
                )}
            </div>
            {fd.metadata?.align === 'right' || !fd.metadata?.align && (
                fd.images[currentPlay]?.url?.endsWith('.webm') ? (
                    <video autoPlay loop muted typeof="video/mp4" src={fd.images[currentPlay]?.url} className="h-96 w-[683px]" />
                ) : (
                    <img src={fd.images[currentPlay]?.url} className="h-96" />
                )
            )}
        </div>
    )
}