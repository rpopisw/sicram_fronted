import axios from 'axios';
import router from '../../router'
const namespaced= true;

const state = {
    especialidades : null, //ESPECIALIDADES DEL DOCTOR
    user: null, //TOKEN Y ID DEL USUARIO
    tipoUser: null,
    
};

const getters = {
    //CONSEGUIR ID Y TOKEN DEL USUARIO
    getUsuario(state){
        return state.user
    },
    
    //CONSEGUIR ESPECIALIDADES
    getEspecialidades(state){
        return state.especialidades
    },

    //CONSEGUIR TIPO DE USUARIO 
    getTipoUsuario(state){
        return state.tipoUser
    }
};

const mutations = {
    //PONE AL USUARIO
    setUsuario(state,payload){
        state.user = payload
    },
    
    //PONER ESPECIALIDADES 
    setEspecialidades(state,payload){
        state.especialidades = payload
    },

    //PONER TIPO DE USUARIO
    setTipoUsuario(state,payload){
        state.tipoUser = payload
    }
};

const actions = {
    //INICIAR SESION DOCTOR 
    loginDoctor({commit,dispatch },doctor){
        return axios
        .post("http://35.192.46.3/api/signindoctor",{
          ...doctor
        })
        .then((res)=>{
            console.log("DOCTOR: ",res.data)
            dispatch('guardarTipoDeUsuario','doctor');
            dispatch('guardarUsuario',res.data);
            dispatch('perfilDoctor', res.data , { root: true })
            return Promise.resolve(true)
        })

        .catch((e)=>{
            console.log(e)
            return Promise.resolve(false)
        })
    },
    //INICIAR SESION ORGANIZACION
    loginOrganizacion({commit,dispatch },organizacion){
        
        return axios
        .post("http://35.192.46.3/api/signinorganizacion",{
          ...organizacion
        })
        .then((res)=>{
            console.log("ORGANIZACION : ",res.data)
            dispatch('guardarTipoDeUsuario','organizacion');
            dispatch('guardarUsuario',res.data);
            dispatch('perfilOrganizacion', res.data , { root: true })
            
            return Promise.resolve(true)
        })

        .catch((e)=>{
            console.log(e)
            return Promise.resolve(false)
        })
       
    },
    //INICIAR SESION PACIENTE
    loginPaciente({commit,dispatch },paciente){
       
        return axios
        .post("http://35.192.46.3/api/signinuser",{
          ...paciente
        })
        .then((res)=>{
            dispatch('getPerfilPaciente', res.data , { root: true })
            console.log("PACIENTE : ",res.data)
            dispatch('guardarTipoDeUsuario','paciente');
            dispatch('guardarUsuario',res.data);
            return Promise.resolve(true)
        })

        .catch((e)=>{
            console.log(e)
            return Promise.resolve(false)
        })
    },
    //CONSULTA DE LAS ESPECIALIDADES DEL SISTEMA
    listarEspecialidades({commit}){
        let url = `http://35.192.46.3/api/especialidad`;
        return axios
        .get(url) 
        .then((res) => {
            console.log(res.data)
            commit('setEspecialidades', res.data)
        })
        .catch((e) => {
          console.log(e);
        });
    },

    //CONSULTA PARA LA PRUEBA
    especialidadesPrueba(){
        return axios
        .get("http://35.192.46.3/api/especialidad") 
        .then(res=> 
            res.data
        )
        .catch((e) => {
          console.log(e);
        });
    },

    //GUADAR USUARIO EN EL LOCALSTORAGE
    guardarUsuario({commit},payload){
        localStorage.setItem('user',JSON.stringify(payload))
        commit('setUsuario',payload)
    },
    //GUARDAR EL ROL DE USUARIO
    guardarTipoDeUsuario({commit},payload){
        localStorage.setItem('tipoUser',payload)
        commit('setTipoUsuario',payload)
    },

    //CERRAR SESION DEL USUARIO 
    cerrarSesion({commit}){
        localStorage.removeItem('user')
        localStorage.removeItem('tipoUser')
        commit('setUsuario',null)
        commit('setTipoUsuario',null)
        router.push({name: 'Login'});
    },

    //VER SI USUARIO SE ENCUENTRA LOGEADO
    leerUsuario({commit,dispatch}){
        const user = JSON.parse(localStorage.getItem('user'))
        const tipoUser =  localStorage.getItem('tipoUser')
        if(user){
            commit('setUsuario',user)
            commit('setTipoUsuario',tipoUser)
            switch(tipoUser){
                case 'paciente' : dispatch('getPerfilPaciente', user , { root: true }); break;
                case 'doctor':  dispatch('perfilDoctor', user , { root: true });break;
                case 'organizacion':  dispatch('perfilOrganizacion', user , { root: true });break;
            }
        }else{
            commit('setUsuario',null)
            commit('setTipoUsuario',null)
        }
    }
}
   
  export default {
    state,
    getters,
    mutations,
    actions,
    
  }