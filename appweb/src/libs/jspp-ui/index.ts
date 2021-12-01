import MySoilder from './MySoilder/index.vue';
import MySoilderItem from './MySoilder/MySoilderItem.vue';

const soilders: any = {};

soilders.install = function(Vue: any) {
    Vue.component(MySoilder.name, MySoilder);
    Vue.component(MySoilderItem.name, MySoilderItem);
};

export default soilders;