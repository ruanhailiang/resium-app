import React from "react";
import {EllipseGraphics, Entity} from "resium";
import {Cartesian3, Color} from "cesium";
import {TSphere} from "./MainWindow";

export const BoundingSphere: Function = (props: { sphere: TSphere }): JSX.Element | null => {
    if (!props.sphere) return null;
    return (
        <Entity key={"BoundingSphere"}
                position={Cartesian3.fromDegrees(props.sphere.centerX, props.sphere.centerY, 50)}>
            <EllipseGraphics semiMajorAxis={props.sphere.radius} semiMinorAxis={props.sphere.radius}
                             extrudedHeight={200000.0}
                             material={Color.BROWN.withAlpha(0.15)}
                             outline/>
        </Entity>
    );
}
