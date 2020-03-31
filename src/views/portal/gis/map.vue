<template>
    <div id="mapCon" style="width: 100%; height: 100%; position: absolute;"></div>
</template>

<script>
//重新加载地图
let providelayer = new EncMap.ENCLayerProvider();
let encTool = new EncMap.EncAddShapeTool();
let encMap;
//标注图层
let featureOverlay;
import point from "@/assets/images/maps/point.png";
export default {
  data() {
    return {};
  },
  mounted() {
    //this.init();
    this.baiduMap();
  },
  methods: {
    init() {
      const box = document.getElementById("mapCon");
      box.innerHTML = "";

      /*加载TileWMTS格式切片服务*/
      const wmtsTile = "http://10.19.151.238:8080/geowebcache/service/wms";
      const wmtsParam = {};
      //对应源代码中的投影
      //wmtsParam.projection = ol.proj.get('EPSG:3857');
      //对应源代码中的源信息（extent最左上角）
      wmtsParam.origin = [-20037508, 20037508];
      //对应源代码中的全图范围信息
      wmtsParam.fullExtent = [
        -20037508.342787,
        -20037508.342781033,
        20037508.342781033,
        20037508.342787
      ];
      //对应源代码中的切片方案信息
      wmtsParam.resolutions = [
        156543.03392800014,
        78271.51696399994,
        39135.75848200009,
        19567.87924099992,
        9783.93962049996,
        4891.96981024998,
        2445.98490512499,
        1222.992452562495,
        611.4962262813797,
        305.74811314055756,
        152.87405657041106,
        76.43702828507324,
        38.21851414253662,
        19.10925707126831,
        9.554628535634155,
        4.77731426794937,
        2.388657133974685,
        1.1943285668550503,
        0.5971642835598172,
        0.29858214164761665
      ];
      wmtsParam.layers = "langfangemap";
      wmtsParam.format = "image/png";
      wmtsParam.SRS = "EPSG:3857";
      wmtsParam.maxRatio = 156543.03392800014;

      const optionInfo = {
        centerX: 12976694.29785,
        centerY: 4743563.564,
        zoom: 9,
        minZoom: 0,
        maxZoom: 19,
        layer: [
          providelayer.getWMSTileLayer(
            wmtsTile,
            wmtsParam,
            wmtsParam.layers,
            "底图"
          )
        ]
      };
      encMap = new EncMap.Map("mapCon", optionInfo);

      //创建标注图层
      featureOverlay = providelayer.getTempLayer();
      encMap.addLayer(featureOverlay, "featureOverlay");
      let _this = this;
      encMap.encmap.on("click", function(event) {
        //添加点
        const points = [
          { attributes: { x: event.coordinate[0], y: event.coordinate[1] } }
        ];
        //绘制，默认点
        _this.addMarks(points);
      });
    },
    addMarks(points) {
      const imgParam = { src: point };
      encTool.addMarks(encMap, points, imgParam, featureOverlay);
    },
    baiduMap() {
      let provider = new EncMap.ENCLayerProvider();
      let baiDu = provider.getBaiduMapLayer({
        mapdiv: "mapCon",
        city: "上海"
      });
      let baidusearch = new EncMap.ENCThirdPartyProviderQuery();
      // baidusearch.baiduAutoCompleteQuery(baiDu,'suggestId');
      // 116.39507,39.934191
      baiDu.addEventListener("click", showInfo);
      function showInfo(e) {
        var m = baidusearch.baiduAddClickPoint(
          baiDu,
          e.point.lng,
          e.point.lat,
          callback,
          callbackPoint
        );
        console.log(m);
      }
      function callback(k) {
        console.log(k);
      }
      function callbackPoint(l) {
        console.log(l);
      }
    }
  }
};
</script>