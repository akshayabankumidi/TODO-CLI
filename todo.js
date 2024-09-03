const fs = require("fs");
const {Command} = require("commander");
const program = new Command();

const PATH ='tasks.json';

function writeTasks(obj,type){
return new Promise((reject)=>{
    fs.writeFile(PATH,obj,(err)=>{
        if(err) {
            reject(err);
         console.log(err);
        } else {
         console.log(`successfully ${type}`);
        }
     });
   });
}

 function readTasks(){
   return new Promise((resolve,reject)=>{
    fs.readFile(PATH, "utf8",(err,data)=>{
        if(err){// file doesnt exist reject
             reject(err);
        } else{
            resolve(data ||'[]');//  file is empty
        }
    });

   });  
     
 }


program
 .name('TODO-CLI')
 .description('CLI for todo tasks')
 .version('0.1.0');        

program.command('create')
.description('creates task')
.argument('<task>','creates task')
.action(async (input)=>{
   try{
    const listOfTasks  = await readTasks();
    const parsedTasks = JSON.parse(listOfTasks);
    const obj = {task:input,completed:false};
    parsedTasks.push(obj);
    await writeTasks(JSON.stringify(parsedTasks,null,2),'created');
   } catch(err){
    console.log(err);
   }
});
 

program.command('delete')
.description("delete the task")
.argument('<task>','delete task')
.action(async (task)=>{
      try{
         const listOfTasks = await readTasks();
         const parsedTasks = JSON.parse(listOfTasks);
         const newTasks = [];
         let mark =-1;
         for(let i =0;i<parsedTasks.length;i++){
            const obj = parsedTasks[i];
            if(obj.task == task){
                mark = i; 
            } else{
                newTasks.push(obj);
            }
         }

         if(mark == -1) throw new error("task not found");
         await writeTasks(JSON.stringify(newTasks,null,2),'deleted');
        
      } catch(err){
        console.log(err);
      }
});

program.command('modify')
.description("modifys the task")
.argument('<task>','modifys task')
.action(async (task)=>{
    try{
        const listOfTasks = await readTasks();
        const parsedTasks = JSON.parse(listOfTasks);
        let mark =-1;
        for(let i =0;i<parsedTasks.length;i++){
           const obj = parsedTasks[i];
           if(obj.task == task){
               obj.completed = true;
               mark =0;
               break;
           } 
        }
        // console.log(parsedTasks);
       if(mark == -1) throw new Error("task not found");
       await writeTasks(JSON.stringify(parsedTasks,null,2),'modified');
     } catch(err){
       console.log(err);
     }
});

program.command('display')
.description("display all tasks")
.action(async ()=>{
    try{
        const listOfTasks = await readTasks();
        const parsedTasks = JSON.parse(listOfTasks);
        console.log(parsedTasks);
    } catch(err){
        console.log(err);
    }

});


program.parse();




