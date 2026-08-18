import JudgeProblem

inductive CandidateCarrier : Type
  | nonneg : Nat → CandidateCarrier
  | negative : Nat → CandidateCarrier

@[reducible] def reflectZero : CandidateCarrier → CandidateCarrier
  | .nonneg 0 => .nonneg 0
  | .nonneg (Nat.succ n) => .negative n
  | .negative n => .nonneg (Nat.succ n)

@[reducible] def reflectOne : CandidateCarrier → CandidateCarrier
  | .nonneg 0 => .nonneg 1
  | .nonneg (Nat.succ 0) => .nonneg 0
  | .nonneg (Nat.succ (Nat.succ n)) => .negative n
  | .negative n => .nonneg (Nat.succ (Nat.succ n))

theorem reflectZero_twice (x : CandidateCarrier) :
    reflectZero (reflectZero x) = x := by
  cases x with
  | nonneg n => cases n <;> rfl
  | negative n => rfl

theorem reflectOne_twice (x : CandidateCarrier) :
    reflectOne (reflectOne x) = x := by
  cases x with
  | nonneg n =>
      cases n with
      | zero => rfl
      | succ n => cases n <;> rfl
  | negative n => rfl

@[reducible] def candidateOp
    (left right : CandidateCarrier) : CandidateCarrier :=
  match left with
  | .nonneg _ => reflectZero right
  | .negative _ => reflectOne right

@[reducible] def candidateMagma : Magma CandidateCarrier := {
  op := candidateOp
}

theorem candidateLaw (x y z : CandidateCarrier) :
    x = candidateOp y (candidateOp (candidateOp z (candidateOp y y)) x) := by
  cases y with
  | nonneg yn =>
      cases z with
      | nonneg zn =>
          cases yn with
          | zero =>
              change x = reflectZero (reflectZero x)
              exact (reflectZero_twice x).symm
          | succ yn =>
              change x = reflectZero (reflectZero x)
              exact (reflectZero_twice x).symm
      | negative zn =>
          cases yn with
          | zero =>
              change x = reflectZero (reflectZero x)
              exact (reflectZero_twice x).symm
          | succ yn =>
              change x = reflectZero (reflectZero x)
              exact (reflectZero_twice x).symm
  | negative yn =>
      cases z with
      | nonneg zn =>
          change x = reflectOne (reflectOne x)
          exact (reflectOne_twice x).symm
      | negative zn =>
          change x = reflectOne (reflectOne x)
          exact (reflectOne_twice x).symm

def submission : Goal := by
  refine ⟨CandidateCarrier, candidateMagma, ?_, ?_⟩
  · intro x y z
    exact (candidateLaw x y z)
  · intro claimed
    have bad := claimed (CandidateCarrier.nonneg 0) (CandidateCarrier.negative 0) (CandidateCarrier.nonneg 1)
    change (CandidateCarrier.nonneg 0) = (CandidateCarrier.negative 0) at bad
    cases bad
