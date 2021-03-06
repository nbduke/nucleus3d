import { TransformNode, Scene } from 'babylonjs';
import INucleusContext from './INucleusContext';
import SystemRegistrar from './SystemRegistrar';
import Entity, { MountingPoint } from '../Entity';

/**
 * Helper class for Nucleus.
 * @public
 */
export default class NucleusHelper {
  private static readonly NUCLEUS_CONTEXT_KEY: string = '__nucleus__';

  /**
   * Gets the Nucleus context for the mounting point.
   * @param mountingPoint - the mounting point
   * @remarks If none is present, one will be initialized.
   */
  public static getContextFor(mountingPoint: MountingPoint): INucleusContext {
    if ((mountingPoint as INucleusContext).systemRegistrar) {
      return mountingPoint as INucleusContext;
    } else if (mountingPoint instanceof Entity) {
      return mountingPoint.context;
    } else {
      let scene: Scene;

      if (mountingPoint instanceof TransformNode) {
        scene = mountingPoint.getScene();
      } else {
        scene = mountingPoint as Scene;
      }

      let context: INucleusContext = (scene as any)[this.NUCLEUS_CONTEXT_KEY]; // tslint:disable-line: no-any

      if (!context) {
        context = this._initializeFor(scene);
      }

      return context;
    }
  }

  private static _initializeFor(scene: Scene): INucleusContext {
    if (scene.isDisposed) {
      throw new Error('Scene has been disposed');
    }

    const context: INucleusContext = {
      engine: scene.getEngine(),
      systemRegistrar: new SystemRegistrar(scene),
      scene
    };

    (scene as any)[this.NUCLEUS_CONTEXT_KEY] = context; // tslint:disable-line: no-any

    return context;
  }
}