const { guardarDB, leerDB } = require('./helpers/guardarArchivo');
const { inquirerMenu, pausa, leerInput, listadoTareasBorrar, confirmar, mostrarListadoChecklist } = require('./helpers/inquirer');
const Tareas = require('./models/tareas');
require('colors');

console.clear();

const main= async() => {

    const tareas= new Tareas();
    let opt= '';

    const tareasDB= leerDB();

    if(tareasDB){
        tareas.cargarTareasFromArray(tareasDB);
    }

    do {
        //Imprimiendo el menu
        opt= await inquirerMenu();    
        
        switch (opt) {
            case '1': //Crear tarea
                const desc= await leerInput('Descripcion: ')
                tareas.crearTarea(desc);
            break;
            
            case '2': //Listar todas las tareas
                tareas.listadoCompleto();
            break;

            case '3': //Listar tareas completadas
                tareas.listarPendientesCompletadas(true);
            break;

            case '4': //Listar tareas completadas
                tareas.listarPendientesCompletadas(false);
            break;

            case '5': //Listar tareas completadas
                const ids= await mostrarListadoChecklist(tareas.listadoArray);
                tareas.toggleCompletadas(ids);
            break;

            case '6': //Completado o pendiente
                const id= await listadoTareasBorrar(tareas.listadoArray);
                if( id !== '0'){
                    const ok = await confirmar('Estas seguro?');
                    if(ok){
                        tareas.borrarTarea(id);
                        console.log('Tarea borrada');
                    }
                }
            break;
        }

        guardarDB(tareas.listadoArray);
        
        await pausa();

    } while (opt !== '0');

}

main();