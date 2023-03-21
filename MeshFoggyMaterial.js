import {MeshStandardMaterial, Color} from 'three'

export class MeshFoggyMaterial extends MeshStandardMaterial {
    constructor( parameters ) {
        super()

        console.log(parameters);

        this.uniforms = {
            fPlane: { value: parameters.plane },
            fDepth: { value: parameters.depth },
            fColor: { value: parameters.color.isColor? parameters.color : new Color(parameters.color) },
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
