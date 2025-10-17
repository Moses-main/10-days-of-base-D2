import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { GREETER_ABI, GREETER_CONTRACT_ADDRESS } from "../contracts/Greeter";
import { baseSepolia } from "viem/chains";

export const useGreeter = () => {
  const {
    data: greeting,
    refetch: refetchGreeting,
    error: readError,
  } = useReadContract({
    address: GREETER_CONTRACT_ADDRESS,
    abi: GREETER_ABI,
    functionName: "greet",
    chainId: baseSepolia.id,
  });

  const {
    writeContract,
    data: hash,
    isPending: isWritePending,
    error: writeError,
  } = useWriteContract();

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    error: confirmError,
  } = useWaitForTransactionReceipt({
    hash,
    chainId: baseSepolia.id,
  });

  

  // ✅ RETURN must be inside the function
  const setGreeting = (greeting: string) => {
    writeContract({
      address: GREETER_CONTRACT_ADDRESS,
      abi: GREETER_ABI,
      functionName: "setGreeting",
      args: [greeting],
      chainId: baseSepolia.id,
    });
  };

  return {
    greeting,
    refetchGreeting,
    readError,
    setGreeting,
    isWritePending,
    writeError,
    isConfirming,
    isConfirmed,
    
     transactionHash:hash,
    confirmError,
  };
};
