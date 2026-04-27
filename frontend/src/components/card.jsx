function Card({ title, desc }) {
  return (
    <div className="w-[223px] h-[269px] shadow-md rounded-xl relative overflow-hidden">
      
      <h6 className="absolute top-0 left-0 right-0 text-white font-semibold text-lg p-4 bg-black/30">
        {title}
      </h6>

      <div className="p-5">
        <p>{desc}</p>
      </div>

    </div>
  )
}

export default Card