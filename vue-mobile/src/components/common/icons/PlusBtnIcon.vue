<template>
  <svg
    width="76"
    height="76"
    viewBox="0 0 76 76"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g filter="url(#filter0_d_34_182)">
      <circle cx="38" cy="38" r="28" fill="#469CF8" />
      <path d="M46 38H30" stroke="white" stroke-width="2" />
      <path d="M38 30L38 46" stroke="white" stroke-width="2" />
    </g>
    <defs>
      <filter
        id="filter0_d_34_182"
        x="0"
        y="0"
        width="76"
        height="76"
        filterUnits="userSpaceOnUse"
        color-interpolation-filters="sRGB"
      >
        <feFlood flood-opacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset />
        <feGaussianBlur stdDeviation="5" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0.109253 0 0 0 0 0.522608 0 0 0 0 0.904167 0 0 0 0.4 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_34_182"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_34_182"
          result="shape"
        />
      </filter>
    </defs>
  </svg>
</template>

<script>
export default {
  name: 'PlusBtnIcon',
}
</script>
