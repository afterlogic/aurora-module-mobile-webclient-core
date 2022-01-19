<template>
  <svg
    :width="width"
    :height="height"
    viewBox="0 0 76 76"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g filter="url(#filter0_d_0_25)">
      <circle cx="38" cy="38" r="28" fill="#469CF8" />
      <path
        d="M25 46V29.8378V28.5C25 27.6716 25.6716 27 26.5 27H34.75L39 30H49C50.1046 30 51 30.8954 51 32V46C51 47.1046 50.1046 48 49 48H27C25.8954 48 25 47.1046 25 46Z"
        stroke="white"
        stroke-width="3"
      />
      <path d="M39 30H25" stroke="white" stroke-width="3" />
    </g>
    <defs>
      <filter
        id="filter0_d_0_25"
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
          result="effect1_dropShadow_0_25"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_0_25"
          result="shape"
        />
      </filter>
    </defs>
  </svg>
</template>

<script>
export default {
  name: 'FolderFilledIcon',
  props: {
    width: { type: Number, default: 76 },
    height: { type: Number, default: 76 },
  },
}
</script>

<style />
