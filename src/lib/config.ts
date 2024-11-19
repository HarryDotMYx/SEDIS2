export const MAPBOX_TOKEN = 'YOUR_MAPBOX_TOKEN';

export const TINYMCE_API_KEY = 'YOUR_TINYMCE_KEY';

export const DEFAULT_DROPZONE_CONFIG = {
  url: '#',
  thumbnailWidth: 80,
  maxFilesize: 5,
  acceptedFiles: 'image/*',
  addRemoveLinks: true,
  dictDefaultMessage: 'Drop files here to upload',
};

export const FLATPICKR_DEFAULT_CONFIG = {
  enableTime: true,
  dateFormat: 'Y-m-d H:i',
};

export const ECHARTS_THEME = {
  color: [
    '#5470c6',
    '#91cc75',
    '#fac858',
    '#ee6666',
    '#73c0de',
    '#3ba272',
    '#fc8452',
    '#9a60b4',
    '#ea7ccc'
  ],
  backgroundColor: 'transparent',
  textStyle: {},
  title: {
    textStyle: {
      color: '#464646'
    },
    subtextStyle: {
      color: '#6E7079'
    }
  },
  line: {
    itemStyle: {
      borderWidth: 1
    },
    lineStyle: {
      width: 2
    },
    symbolSize: 4,
    symbol: 'circle',
    smooth: false
  },
  radar: {
    itemStyle: {
      borderWidth: 1
    },
    lineStyle: {
      width: 2
    },
    symbolSize: 4,
    symbol: 'circle',
    smooth: false
  }
};