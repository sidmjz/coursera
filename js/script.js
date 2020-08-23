// Closures
function makeMultiplier (multiplier) {
  function b() {
    console.log("Multiplier is " + multiplier);
  }
  b();
  return (
    function (x) {
      return multiplier * x;
    }
  );
}

var doubleInput = makeMultiplier(2);
console.log(doubleInput(10));

