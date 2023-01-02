import db from '../../firebase/firestore'

interface CreateAdoptionDTO {
    id?: string,
    user_id: string,
    pet_id: string,
    is_concluded: boolean
}

export class AdoptionRepository {
    public async create(adoption: CreateAdoptionDTO){
        const result = await db.adoptions.add(adoption)
        return result.id
    }

    public async readOne(id: string) {
        const adoptionRef = await db.adoptions.doc(id).get()
        if(!adoptionRef.exists){
            return undefined
        }
        const adoption = { id: adoptionRef.id, ...adoptionRef.data() }
        return adoption
    }

    public async readByPetId(pet_id: string) {
        const adoption = (await db.adoptions.where('pet_id', '==', pet_id).get()).docs[0]
    
        if(!adoption){
            return undefined
        }

        return {id: adoption.id, ...adoption.data() }
    }

    public async readByUserId(user_id: string) {
        const adoptionsRef = (await db.adoptions.where('user_id', '==', user_id).get()).docs
        if(!adoptionsRef){
            return undefined
        }

        const adoptions = adoptionsRef.map(adoption =>{
            return {id: adoption.id, ...adoption.data() }
        })

        return adoptions
    }

    public async readAll() {
        const adoptionsRef = await db.adoptions.get()
        const adoptions = adoptionsRef.docs.map(doc=>{
            return {id: doc.id, ...doc.data()}
        })
        return adoptions
    }

    public async updateOne(adoption: CreateAdoptionDTO){
        const {id, ...adoptionData} = adoption
        if(!id){
            return undefined
        }

        await db.adoptions.doc(id).update(adoptionData)
        
        return id
    }

    public async deleteOne(id: string){
        await db.adoptions.doc(id).delete()
    }
}