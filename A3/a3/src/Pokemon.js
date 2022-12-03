import React from 'react'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import PokemonImage from './PokemonImage'

function Pokemon(props) {
  const getThreeDigitId = (id) => {
    if (id < 10) return `00${id}`
    if (id < 100) return `0${id}`
    return id
  }
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 20,
    p: 6,
  };

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
    <div>
      <PokemonImage id={getThreeDigitId(props.pokemon.id)} handleOpen={handleOpen}/>
      {/* <img src={`https://github.com/fanzeyi/pokemon.json/raw/master/images/${getThreeDigitId(props.pokemon.id)}.png`} /> */}
      <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        {props.pokemon.name.english}
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        HP: [{props.pokemon.base.HP}]
                        <br/>
                        Attack: [{props.pokemon.base.Attack}]
                        <br/>
                        Defense: [{props.pokemon.base.Defense}]
                        <br/>
                        Sp. Attack: [{props.pokemon.base['Sp. Attack']}]
                        <br/>
                        Speed: [{props.pokemon.base.Speed}]
                        <br/>
                        Types: [
                        {props.pokemon.type.map(item => {
                            return <> {item}, </>
                        })}
                        ] <br/>
                    </Typography>
                </Box>
            </Modal>
            </div>
    </>
  )
}

export default Pokemon