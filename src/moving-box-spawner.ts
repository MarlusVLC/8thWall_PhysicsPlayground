// This is a component file. You can use this file to define a custom component for your project.
// This component will appear as a custom component in the editor.

import * as ecs from '@8thwall/ecs'  // This is how you access the ecs library.
import {MoverComponent} from './mover'

// var mover : any;
// var logInterval;  // Declare a variable to hold the MoverComponent instance
// var repetitionCount = 0;  // Counter to track the number of repetitions

ecs.registerComponent({
  name: 'moving-box-spawner',
  schema: {
    // @group start spawnPoint:vector3
    spawnX: ecs.f32, spawnY: ecs.f32, spawnZ: ecs.f32,
    // @group end
  },
  // schemaDefaults: {
  // },
  data: {
    logInterval: ecs.f32,
    repetitionCount: ecs.f32,
    moverEid: ecs.eid,
    // mover: ,  // Include the MoverComponent schema in the data
  },
  add: (world, component) => {
    
    component.data.logInterval = world.time.setInterval(() => {
      if (++component.data.repetitionCount > 5) {
        world.time.clearTimeout(component.data.logInterval);  // Stop the interval after 5 repetitions
        return;
      }
      const mover = MoverComponent.get(world, component.data.moverEid);
      console.log(`MOVER for new entity has (${mover.baseName} as name):`, mover);
    }, 1000)  // Call the function every 1000 milliseconds (1 second)
  },
  // tick: (world, component) => {
    // console.log(`MOVER for new entity has (${mover.baseName} as name):`, mover);
  // },
  // remove: (world, component) => {
  // },
  stateMachine: ({world, eid, schemaAttribute, dataAttribute}) => {
    const schemaCursor = schemaAttribute.cursor(eid)
    const dataCursor = dataAttribute.cursor(eid)
    console.log(`cursor.spawnX: ${schemaCursor.spawnX}, cursor.spawnY: ${schemaCursor.spawnY}, cursor.spawnZ: ${schemaCursor.spawnZ}`);

    ecs.defineState('default')
    .initial()
    .onEnter(() => {
      // Create a new entity with the MoverComponent
      const newEntity = world.createEntity();
      
      world.setPosition(newEntity, schemaCursor.spawnX, schemaCursor.spawnY, schemaCursor.spawnZ);
      console.log('Spawning new entity (${newEntity}) at:', schemaCursor.spawnX, schemaCursor.spawnY, schemaCursor.spawnZ);

//-----------------------------------------------------------------------------------------------------------------------
      // Set the MoverComponent on the new entity
      MoverComponent.set(world, newEntity, {});

      dataCursor.moverEid = newEntity;  // Store the entity ID of the MoverComponent in the data
      const mover = MoverComponent.get(world,  dataCursor.moverEid);  // Retrieve the MoverComponent instance for the new entity
      // mover = MoverComponent.get(world, newEntity);

      console.log(`MOVER for new entity has (${mover.baseName} as name):`, mover);

      MoverComponent.mutate(world, newEntity, (cursor) => {
        cursor.baseName = 'MutatedBox';
        return true;  // Return true to indicate that the mutation was successful
      });

      console.log(`MOVER for new entity has (${mover.baseName} as name):`, mover);

      MoverComponent.reset(world, newEntity);

      console.log(`MOVER for new entity has (${mover.baseName} as name):`, mover);
      
      // MoverComponent.remove(world, newEntity)  // Remove the MoverComponent from the new entity

      const isMoverPresent = MoverComponent.has(world, newEntity);
      console.log(`Is MoverComponent present on new entity? ${isMoverPresent}`);  // Should log 'true'

//-----------------------------------------------------------------------------------------------------------------------
      // Set the BoxGeometry and Material components on the new entity
      ecs.BoxGeometry.set(world, newEntity, {
        width: 1,
        height: 1,
        depth: 1
      });

      const box = ecs.BoxGeometry.get(world, newEntity);
      console.log(`Box geometry for new entity has (${box.depth} of depth):`, box);

      // ecs.BoxGeometry.mutate(world, newEntity, (cursor) => {
      //   cursor.depth *= 10;
      //   return true;  // Return true to indicate that the mutation was successful
      // });

      const boxCursor = ecs.BoxGeometry.cursor(world, newEntity);
      boxCursor.depth *= 7.5;

      console.log(`Box geometry for new entity has (${box.depth} of depth):`, box);

      // ecs.BoxGeometry.reset(world, newEntity);

      console.log(`Box geometry for new entity has (${box.depth} of depth):`, box);


      //-----------------------------------------------------------------------------------------------------------------------
// Set the Material component on the new entity
      ecs.Material.set(world, newEntity, {
          r: 255,
          g: 255,
          b: 255,
      })

      const materialAcquired = ecs.Material.acquire(world, newEntity);
      materialAcquired.r = 0;
      materialAcquired.g = 255;
      materialAcquired.b = 0;

      ecs.Material.commit(world, newEntity);  // Commit the changes to the Material component
      ecs.Material.dirty(world, newEntity);  // Mark the Material component as dirty to trigger a re-render
    })
  }
})
