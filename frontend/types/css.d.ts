declare module "*.css" {
  const content: { [className: string]: string };
  export default content;
}

declare module "mapbox-gl/dist/mapbox-gl.css";
declare module "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
