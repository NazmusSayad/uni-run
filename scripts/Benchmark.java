public class Benchmark {
  public static void main(String[] args) {
    // Arithmetic operations
    long arithSum = 0;
    for (int i = 0; i < 100000000; i++) {
      arithSum += i * 2;
    }

    // String concatenation
    StringBuilder strConcat = new StringBuilder();
    for (int i = 0; i < 100000; i++) {
      strConcat.append("test");
    }

    // Array operations
    int[] arr = new int[100000];
    for (int i = 0; i < 100000; i++) {
      arr[i] = i;
    }
    long arrSum = 0;
    for (int num : arr) {
      arrSum += num;
    }

    // Function calls
    long funcSum = 0;
    for (int i = 0; i < 1000000; i++) {
      funcSum += square(i);
    }
  }

  public static int square(int n) {
    return n * n;
  }
}
