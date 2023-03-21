import {MeshStandardMaterial, Color, Vector4} from 'three'

export class MeshFoggyMaterial extends MeshStandardMaterial {
    constructor( parameters ) {
        super()

        this.uniforms = {
            fPlane: { value: parameters.fogPlane ? parameters.fogPlane : new Vector4() },
            fDepth: { value: parameters.fogDepth ? parameters.fogDepth : 200 },
            fColor: { value: parameters.fogColor ? parameters.fogColor.isColor ? parameters.fogColor : new Color(parameters.fogColor) : new Color(0xffffff) }
        }

        for (const property in this) {
            if (property in parameters){
                if(this[property].isColor){
                    this[property] = parameters[property].isColor ? parameters[property] : new Color(parameters[property])
                }
                else{
                    this[property] = parameters[property];
                }
            }
        }

        this.onBeforeCompile = (shader) => {
            shader.uniforms = {
                ...shader.uniforms,
                ...this.uniforms
            }

            shader.fragmentShader = `
            uniform vec4 fPlane;
            uniform float fDepth;
            uniform vec3 fColor;
          ` + shader.fragmentShader;
          shader.fragmentShader = shader.fragmentShader.replace(
            `#include <clipping_planes_fragment>`,
            `#include <clipping_planes_fragment>
            float planeFog = 0.0;
            planeFog = smoothstep(0.0, -fDepth, dot( vViewPosition, fPlane.xyz) - fPlane.w);
            `
          );
          shader.fragmentShader = shader.fragmentShader.replace(
            `#include <fog_fragment>`,
            `#include <fog_fragment>
             gl_FragColor.rgb = mix( gl_FragColor.rgb, fColor, planeFog );
            `
          )
        }
    }
}
