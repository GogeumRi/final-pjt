<template>
  <article>
  <div class="container-fluid mt-3">
    <div class="row">
      <div class="col-md-3">
        <div class="search-card">
          <h5 class="mb-3">은행 찾기</h5>
          <hr>
          <div class="mb-2">
            <label class="form-label">광역시 / 도</label>
            <select v-model="selectedMetro" class="form-select">
              <option selected>광역시 / 도를 선택하세요</option>
              <option v-for="metrocity in mapData.mapInfo" 
              :key="metrocity.name" 
              :value="metrocity.name">{{ metrocity.name }}</option>
            </select>
          </div>
          <div class="mb-2">
            <label class="form-label">시 / 군 / 구</label>
            <select v-model="selectedCity" class="form-select">
              <option v-for="country in citys" :key="country">{{ country }}</option>
            </select>
          </div>
          <div class="mb-3">
            <label class="form-label">은행</label>
            <select v-model="selectedBank" class="form-select">
                <option v-for="bank in mapData.bankInfo" :key="bank">{{ bank }}</option>
            </select>
          </div>
          <button @click="inputSearch" class="btn btn-primary w-100">찾기</button>
        </div>
        <p v-if="selectedCity === '시 / 군 / 구를 선택하세요'" class="mt-3 text-danger">지역을 선택하지 않으면 현재 지도 중심으로 가장 가까운 은행을 검색합니다.</p>
      </div>
      <!-- 우측: 지도 영역 -->
      <div class="col-md-9">
        <KakaoMap class="w-100" :lat="initLat" :lng="initLng" @onLoadKakaoMap="onLoadKakaoMap">
          <KakaoMapMarker
            v-for="(marker, index) in markerList"
            :key="marker.key === undefined ? index : marker.key"
            :lat="marker.lat"
            :lng="marker.lng"
            @onClickKakaoMapMarker="onClickKakaoMapMarker(marker)"
            @mouseOverKakaoMapMarker="mouseOverKakaoMapMarker(marker)"
            @mouseOutKakaoMapMarker="mouseOutKakaoMapMarker(marker)"
            :clickable="true"
            />
          <KakaoMapCustomOverlay
            v-for="(marker, index) in markerList" :key="index"
            :lat="marker.lat"
            :lng="marker.lng"
            :visible="marker.visible[0] || marker.visible[1]"
            :content="overlayRefs[index] ? overlayRefs[index].outerHTML : ''" 
            />
        </KakaoMap>
    </div>
  </div>
</div>
<div v-for="(marker, index) in markerList" :key="index" style="display: none;">
  <div :ref="el => overlayRefs[index] = el">
    <div class="customoverlay">
    <a target="_blank">
        <span class="title">{{ marker.placename }}</span>
    </a>
    </div>
    </div>
</div>
  </article>
</template>

<script setup>
import { ref, watch } from 'vue'
import mapData from '@/map_data.json'
import { KakaoMap, KakaoMapCustomOverlay, KakaoMapMarker } from 'vue3-kakao-maps'

const overlayRefs = ref([])

const initLat = ref(37.566826)
const initLng = ref(126.9786567)

navigator.geolocation.getCurrentPosition((position) => {
  initLat.value = position.coords.latitude
  initLng.value = position.coords.longitude
});

const selectedMetro = ref('광역시 / 도를 선택하세요')
const selectedCity = ref('시 / 군 / 구를 선택하세요')
const selectedBank = ref('국민은행')
const citys = ref(['시 / 군 / 구를 선택하세요'])

const map = ref(null)
const markerList = ref([])

watch((selectedMetro), (newValue, oldValue) => {
    const init = ['시 / 군 / 구를 선택하세요']
    citys.value = init
    selectedCity.value = '시 / 군 / 구를 선택하세요'
    mapData.mapInfo.forEach(metro => {
        if (metro.name === newValue) {
            const newcitys = [
                ...init,
                ...metro.countries
            ]
            citys.value = newcitys
        }
    });
})

const onLoadKakaoMap = (mapRef) => {
  map.value = mapRef;
  const ps = new kakao.maps.services.Places();
  ps.keywordSearch(`${selectedMetro.value} ${selectedCity.value} ${selectedBank.value}`, placesSearchCB);
};

const inputSearch = () => {
  const ps = new kakao.maps.services.Places();
  if (selectedCity.value === '시 / 군 / 구를 선택하세요') {
    const center = map.value.getCenter();
    ps.keywordSearch(`${selectedBank.value}`, placesSearchCB, {
    radius : 2000,
    location: new kakao.maps.LatLng(center.getLat(), center.getLng())
    }); 
  } else {
  ps.keywordSearch(`${selectedMetro.value} ${selectedCity.value} ${selectedBank.value}`, placesSearchCB);
  }
}

const placesSearchCB = (data, status) => {
  if (status === kakao.maps.services.Status.OK) {
    const bounds = new kakao.maps.LatLngBounds();
    markerList.value = []
    for (let marker of data) {
      const markerItem = {
        lat: marker.y,
        lng: marker.x,
        placename: marker.place_name,
        visible: [false, false]
        }
      markerList.value.push(markerItem);
      bounds.extend(new kakao.maps.LatLng(Number(marker.y), Number(marker.x)));
    }
    map.value?.setBounds(bounds);
  }
}

const onClickKakaoMapMarker = (marker) => {
  marker.visible[0] = !marker.visible[0];
};

const mouseOverKakaoMapMarker = (marker) => {
  marker.visible[1] = true;
};

const mouseOutKakaoMapMarker = (marker) => {
  marker.visible[1] = false;
};

</script>

<style scoped>
.customoverlay {position:relative;bottom:75px;border-radius:6px;border: 1px solid #ccc;border-bottom:2px solid #ddd;float:left;}
.customoverlay:nth-of-type(n) {border:0; box-shadow:0px 1px 2px #888;}
.customoverlay a {display:block;text-decoration:none;color:#000;text-align:center;border-radius:6px;font-size:14px;font-weight:bold;overflow:hidden;background: #d95050;background: #ffd756 no-repeat right 14px center;}
.customoverlay .title {display:block;text-align:center;background:#fff;margin-right:35px;padding:10px 15px;font-size:14px;font-weight:bold;}
.customoverlay:after {content:'';position:absolute;margin-left:-12px;left:50%;bottom:-12px;width:22px;height:12px;background:url('https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/vertex_white.png')}
</style>