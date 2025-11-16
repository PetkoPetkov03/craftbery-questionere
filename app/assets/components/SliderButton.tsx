import React, { type ButtonHTMLAttributes } from 'react'
import { Action, type SliderController } from '~/routine/routine'

const SliderButton = ({ t, control }: {t: Action,control: () => void}) => {
  return (
    <svg className={t === Action.BACK ? "slider-button-back" : "" } onClick={control}
          width="61"
          height="61"
          viewBox="0 0 61 61"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="60.06" height="60.06" rx="30.03" fill="#EEF7FB" />
          <g clip-path="url(#clip0_2_365)">
            <path
              d="M36.4287 30.03L28.4237 22.02L26.8227 23.622L33.2267 30.03L26.8227 36.438L28.4237 38.04L36.4287 30.03Z"
              fill="#1C2635"
              stroke="#1C2635"
              stroke-width="0.16"
            />
          </g>
          <defs>
            <clipPath id="clip0_2_365">
              <rect
                width="16.01"
                height="16.02"
                fill="white"
                transform="translate(22.0195 22.02)"
              />
            </clipPath>
          </defs>
        </svg>
  )
}

export default SliderButton