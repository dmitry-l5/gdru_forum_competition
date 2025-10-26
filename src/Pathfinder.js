import { RecastJSPlugin } from "@babylonjs/core";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { Color3 } from "@babylonjs/core/Maths/math.color";
import Recast from "recast-detour";


export function Pathfinder(scene) {
    this.scene = scene;
    this.navMeshPlugin = null;
    this.navDebugMesh = null;
    this.recast = null;
}

Pathfinder.prototype = Object.create(null);
Pathfinder.prototype.constructor = Pathfinder;

Pathfinder.prototype.init = async function() {
    try {
        this.recast = await Recast();
        this.navMeshPlugin = new RecastJSPlugin(this.recast);
    } catch (error) {
        throw error;
    }
};

Pathfinder.prototype.buildNavMesh = async function(meshes, options = {}) {
    if (!this.navMeshPlugin) {
        return Promise.reject(new Error("RecastJSPlugin not initialized."));
    }
    const navMeshMeshes = meshes;

    const navmeshParameters = {
        cs: options.cs || .5, // Cell Size
        ch: options.ch || .25, // Cell Height
        walkableSlopeAngle: options.walkableSlopeAngle || 90, // Walkable Slope Angle
        walkableHeight: options.walkableHeight || 1.0, // Walkable Height
        walkableClimb: options.walkableClimb || 1, // Walkable Climb
        walkableRadius: options.walkableRadius || 0.1, // Walkable Radius
        maxEdgeLen: options.maxEdgeLen || 12., // Max Edge Length
        maxSimplificationError: options.maxSimplificationError || 1.3, // Max Simplification Error
        minRegionArea: options.minRegionArea || 1, // Min Region Area
        mergeRegionArea: options.mergeRegionArea || 20, // Merge Region Area
        maxVertsPerPoly: options.maxVertsPerPoly || 6, // Max Verts Per Poly
        detailSampleDist: options.detailSampleDist || 6, // Detail Mesh Sample Distance
        detailSampleMaxError: options.detailSampleMaxError || 1, // Detail Mesh Sample Max Error
    };
    this.navMeshPlugin.createNavMesh(navMeshMeshes, navmeshParameters );
};

Pathfinder.prototype.findPath = function(startPoint, endPoint) {
    if (!this.navMeshPlugin || !this.navMeshPlugin.navMesh) {
        return null;
    }
    const path = this.navMeshPlugin.computePath(startPoint, endPoint);
    if (path && path.length > 0) {
        return path;
    } else {
        return null;
    }
};

Pathfinder.prototype.reset = function() {
    if (this.navMeshPlugin) {
        this.navMeshPlugin.dispose();
    }
    this.navMeshPlugin = new RecastJSPlugin();
    this.clearNavMesh();
};

Pathfinder.prototype.displayNavMesh = function() {
  
    if (!this.navMeshPlugin || !this.navMeshPlugin.navMesh) {
        return;
    }
    if (this.navDebugMesh && !this.navDebugMesh.isDisposed()) {
        this.navDebugMesh.dispose();
        this.navDebugMesh = null;
    }

    const debugMesh = this.navMeshPlugin.createDebugNavMesh(this.scene);
    if (debugMesh) {
        this.navDebugMesh = debugMesh;
        this.navDebugMesh.name = "navMeshDebugDisplay";
        this.navDebugMesh.material = new StandardMaterial("navMeshMat", this.scene);
        (this.navDebugMesh.material).diffuseColor = new Color3(0.1, 0.5, 0.8);
        (this.navDebugMesh.material).alpha = 0.5;
        this.navDebugMesh.isPickable = false;
    } else {
         console.warn("Pathfinder: Failed to create debug navmesh from RecastJSPlugin.");
    }
};

Pathfinder.prototype.clearNavMesh = function() {
    if (this.navDebugMesh && !this.navDebugMesh.isDisposed()) {
        this.navDebugMesh.dispose();
        this.navDebugMesh = null;
    }
    if (this.navMeshPlugin && this.navMeshPlugin.navMesh) {
        this.navMeshPlugin.navMesh.destroy();
        this.navMeshPlugin.navMesh = null;
    }
};

Pathfinder.prototype.dispose = function() {
    this.clearNavMesh();
    if (this.navMeshPlugin) {
        this.navMeshPlugin.dispose();
        this.navMeshPlugin = null;
    }
};